module Wordcloud exposing (main)

import Animation
import Browser
import Browser.Dom exposing (Viewport, getViewport)
import Browser.Events as Events
import Canvas exposing (Renderable)
import Canvas.Settings
import Canvas.Settings.Advanced
import Canvas.Settings.Text
import Color
import Dict
import Html exposing (Html, div, label, option, p, select, text)
import Html.Attributes as Attr exposing (class, style)
import Html.Events exposing (on, onClick)
import Html.Keyed as Keyed
import Json.Decode as Dec
import Json.Decode.Pipeline exposing (hardcoded, required)
import Json.Encode as Enc
import List.Extra as Listx
import Math.Vector2 as Vec2
import Task
import Time
import WordcloudData exposing (dataString)


cloudSizeOrig =
    { width = 1000, height = 500 }


fontForCloud =
    "'Open Sans Condensed'"


fontForTitles =
    "Roboto"


animLengthDefault =
    6

--sec


type alias Model =
    { animating : Bool
    , animation : Animation
    , h : Float
    , kuss : Animation
    , periods : List CloudPeriod
    , slider : Int
    , w : Float
    }


type Msg
    = Animating Bool
    | Dt Float
    | GetViewport Viewport
    | Resized
    | Slide String



--------------------------


type alias Cloud =
    List PrettyWord


type alias CloudTopic =
    { name : String
    , fadeIn : Bool
    , fadeOut : Bool
    , major_topic : List Int
    , cloud : Cloud
    }


type alias CloudPeriod =
    { id : String
    , topics : List CloudTopic
    }


type alias CloudPeriods =
    List CloudPeriod


type alias Frame =
    { size : Float
    , rotate : Float
    , x : Float
    , y : Float
    , color : HSLA
    }


type alias HSLA =
    { hue : Float
    , saturation : Float
    , lightness : Float
    , alpha : Float
    }


type alias PrettyWord =
    { text : String
    , size : Float
    , font : String
    , style : String
    , weight : String
    , rotate : Float
    , padding : Int
    , x : Float
    , y : Float
    , color : HSLA
    , startState : Maybe Frame
    , endState : Maybe Frame
    }


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , subscriptions = subscriptions
        , update = update
        , view = view
        }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { animating = True 
      , animation = animSet 0 1 animLengthDefault -1 -- from / to / duration / delay
      , h = 0
      , kuss = animSet 0 1 (animLengthDefault/2) 0  -- from / to / duration / delay
      , periods = rawPeriods
      , slider = 50
      , w = 0
      }
    , Task.perform GetViewport getViewport
    )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Events.onAnimationFrameDelta Dt
        , Events.onResize (\_ _ -> Resized)
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Animating bool->
            ( { model | animating = bool }, Cmd.none )

        Dt dt ->
            if not model.animating
                then
                    ( model, Cmd.none )

                else
                    case animRunning model.animation of
                        True ->
                            ( { model | animation = animUpdate model.animation dt model.slider }
                            , Cmd.none
                            )

                        False ->
                            case animRunning model.kuss of
                                True ->
                                    let
                                        ( animation, periods, kuss ) =
                                            case animRender model.kuss >= 0.97 of
                                                True ->
                                                    ( animStart model.animation, shift 1 model.periods, animStop model.kuss )

                                                False ->
                                                    ( model.animation, model.periods, animUpdate model.kuss dt model.slider )
                                    in
                                    ( { model
                                        | kuss = kuss
                                        , animation = animation
                                        , periods = periods
                                      }
                                    , Cmd.none
                                    )

                                False ->
                                    case model.h > 0 && model.w > 0 of
                                        True ->
                                            ( { model | kuss = animStart model.kuss }
                                            , Cmd.none
                                            )

                                        False ->
                                            ( model, Cmd.none )

        GetViewport data ->
            ( { model
                | h = data.viewport.height
                , w = data.viewport.width
                , animation = animStart model.animation
              }
                |> placePeriods
            , Cmd.none
            )

        Resized ->
            ( { model
                | kuss = animStop model.kuss
                , periods = rawPeriods
              }
            , Task.perform GetViewport getViewport
            )

        Slide value ->
            case String.toInt value of
                Just int->
                    ( { model | slider = int }, Cmd.none )

                Nothing->
                    ( model, Cmd.none )


view : Model -> Html Msg
view model =
    let
        key = String.fromFloat model.w ++ "|" ++ String.fromFloat model.h 
    in
    Keyed.node "div"
        [ style "align-items" "center"
        ]
        [ ( key
         , Canvas.toHtml
                ( round model.w, round model.h )
                []
                ( clearScreen model :: viewClouds model )
          )
        , ( key
          , sliderWithButts model
          )
        ]


clearScreen model =
    Canvas.shapes [ Canvas.Settings.fill Color.white ] [ Canvas.rect ( 0, 0 ) model.w model.h ]



-----------------------------------------


type alias Animation =
    { dt : Float
    , script :
        { from : Float
        , to : Float
        , duration : Float
        , delay : Float
        }
    }


animRunning : Animation -> Bool
animRunning anim =
    anim.dt < anim.script.duration + anim.script.delay


animRender : Animation -> Float
animRender anim =
    let
        animation =
            Animation.animation 0
                |> Animation.from anim.script.from
                |> Animation.to anim.script.to
                |> Animation.duration anim.script.duration
                |> Animation.delay anim.script.delay
    in
    Animation.animate anim.dt animation


animSet : Float -> Float -> Float -> Float -> Animation
animSet from to duration delay =
    { dt = duration + delay
    , script =
        { from = from
        , to = to
        , duration = duration
        , delay = delay
        }
    }


animStop : Animation -> Animation
animStop anim =
    { anim | dt = anim.script.duration + anim.script.delay }


animStart : Animation -> Animation
animStart anim =
    { anim | dt = 0 }


animUpdate : Animation -> Float -> Int -> Animation
animUpdate anim timeDelta sliderVal =
    { anim | dt = anim.dt + timeDelta * (1 / 1000) * (toFloat sliderVal / 50) }



-------------------------


accentDict : Dict.Dict Char Char
accentDict =
    Dict.fromList
        [ ( 'Á', 'A' )
        , ( 'É', 'E' )
        , ( 'Í', 'I' )
        , ( 'Ó', 'O' )
        , ( 'Ú', 'U' )
        , ( 'Ö', 'O' )
        , ( 'Ő', 'O' )
        , ( 'Ü', 'U' )
        , ( 'Ű', 'U' )
        , ( 'á', 'a' )
        , ( 'é', 'e' )
        , ( 'í', 'i' )
        , ( 'ó', 'o' )
        , ( 'ú', 'u' )
        , ( 'ö', 'o' )
        , ( 'ő', 'o' )
        , ( 'ü', 'u' )
        , ( 'ű', 'u' )
        ]


accentRemove : String -> String
accentRemove txt =
    let
        checkchar a =
            case Dict.get a accentDict of
                Just b ->
                    b

                Nothing ->
                    a
    in
    String.map checkchar txt


apply f a =
    f a

butt model =
    let
        (msg, id) =
            case model.animating of
                True->
                    ([onClick (Animating False)], "fa-pause-circle")

                False->
                    ([onClick (Animating True)], "fa-play-circle")
    in
    fontAwe msg "is-large has-text-warning" ("fas fa-3x " ++ id)

currentPeriodOf : Model -> CloudPeriod
currentPeriodOf model =
    case model.periods of
        x :: _ ->
            x

        [] ->
            emptyCloudPeriod

decodeCloud =
    Dec.list decodePrettyWord


decodeCloudPeriod =
    Dec.map2
        CloudPeriod
        (Dec.field "id" Dec.string)
        (Dec.field "topics" (Dec.list decodeCloudTopic))


decodeCloudPeriods =
    Dec.list decodeCloudPeriod


decodeCloudTopic =
    Dec.map5
        CloudTopic
        (Dec.field "name" Dec.string)
        (Dec.succeed True) --fadeIn
        (Dec.succeed True) --fadeOut
        (Dec.field "major_topic" (Dec.list Dec.int))
        (Dec.field "words" decodeCloud)


decodeHSLA =
    let
        decHue =
            Dec.float |> Dec.andThen normalize

        normalize a =
            Dec.succeed (a / 360)
    in
    Dec.map4
        HSLA
        (Dec.field "hue" decHue)
        (Dec.field "saturation" Dec.float)
        (Dec.field "lightness" Dec.float)
        (Dec.field "alpha" Dec.float)


decodePrettyWord =
    Dec.succeed
        PrettyWord
        |> required "text" Dec.string
        |> required "size" Dec.float
        |> required "font" Dec.string
        |> required "style" Dec.string
        |> required "weight" Dec.string
        |> required "rotate" Dec.float
        |> required "padding" Dec.int
        |> required "x" Dec.float
        |> required "y" Dec.float
        |> required "color" decodeHSLA
        |> hardcoded Nothing --startState
        |> hardcoded Nothing --endState


diff : CloudPeriod -> CloudPeriod -> CloudPeriod
diff prev current =
    let
        diffTopic topic =
            { topic | cloud = List.map (diffWord prev topic) topic.cloud |> List.concat }
    in
    { current | topics = List.map diffTopic current.topics }


diffRelevant : CloudTopic -> CloudTopic -> Bool
diffRelevant curr prev =
    intersects curr.major_topic prev.major_topic
    && curr.name /= prev.name


diffWord : CloudPeriod -> CloudTopic -> PrettyWord -> List PrettyWord
diffWord previousPeriod currentTopic word =
    let
        sameWord a =
            word.text == a.text

        state a =
            setFrame a.size a.rotate a.x a.y a.color

        startSmall a =
            setFrame 0 a.rotate a.x a.y a.color

        relevantPreviousTopics = 
            List.filter (diffRelevant currentTopic) previousPeriod.topics

        relevantPreviousWords =
            List.map .cloud relevantPreviousTopics |> List.concat

        initializeFrom x =
            { word | startState = Just (state x), endState = Just (state word) }
    in
    case List.filter sameWord relevantPreviousWords of
        [] ->
            [ { word | startState = Just (startSmall word), endState = Just (state word) } ]

        xs ->
            List.map initializeFrom xs


emptyCloudPeriod =
    { id = ""
    , topics = []
    }

emptyCloudTopic =
    { name = ""
    , fadeIn = False
    , fadeOut = False
    , major_topic = []
    , cloud = []
    }


faderOpacity : Bool -> Bool -> Animation -> Animation -> Float
faderOpacity fadeIn fadeOut anim kuss =
    case animRunning anim of
        True ->
            case fadeIn of
                True ->
                    animRender anim

                False ->
                    1

        False ->
            case animRunning kuss of
                True ->
                    case fadeOut of
                        True ->
                            1 - animRender kuss

                        False ->
                            1

                False ->
                    1

fontAwe attrs clss id =
    Html.span 
        ( attrs ++ [ class ("icon " ++ clss) ]) 
        [ Html.node "i" 
            [ class id ] 
            [] 
        ]

intersects : List a -> List a -> Bool
intersects list1 list2 =
    let
        checker a =
            List.member a list1
    in
    List.any checker list2


interpolate : Float -> Float -> Float -> Float
interpolate start end animStage =
    (1 - animStage) * start + animStage * end


interpolateColor : HSLA -> HSLA -> Float -> HSLA
interpolateColor start end animStage =
    { hue = interpolate end.hue start.hue animStage
    , saturation = interpolate end.saturation start.saturation animStage
    , lightness = interpolate end.lightness start.lightness animStage
    , alpha = interpolate end.alpha start.alpha animStage
    }


interpolateWord : Float -> PrettyWord -> PrettyWord -> PrettyWord
interpolateWord animStage start end =
    end


myRotate : Float -> Float -> Float -> Canvas.Settings.Setting
myRotate x y deg =
    Canvas.Settings.Advanced.transform
        [ Canvas.Settings.Advanced.translate x y
        , Canvas.Settings.Advanced.rotate deg
        , Canvas.Settings.Advanced.translate -x -y
        ]


opaqueBlack opa =
    Color.fromHsla
        { hue = 0
        , saturation = 0
        , lightness = 0.37
        , alpha = opa
        }

placeForPeriod model =
    ( model.w / 2 , 7/30 * model.h )

placeForSlider model =
    let
        top =
            32

        left =
            model.w * 1/3

        width =
            model.w * 1/3
    in
    case model.w > 0 && model.h > 0 of
        True->
            [ style "top" (String.fromFloat top ++ "px")
            , style "left" (String.fromFloat left ++"px")
            , style "width" (String.fromFloat width ++"px")
            , style "position" "absolute"
            ]

        False->
            [ style "display" "none" ]


placementMatrix =
    [ (1/8, 1/6), (7/8, 1/6)
    , (1/8, 3/6), (3/8, 3/6), (5/8, 3/6), (7/8, 3/6)
    , (1/8, 5/6), (3/8, 5/6), (5/8, 5/6), (7/8, 5/6)
    ]

placePeriod : Float -> Float -> Float -> CloudPeriod -> CloudPeriod
placePeriod sc w h current =
    let
        toCenter ( x, y ) =
            ( x * w, y * h )

        centers =
            List.map toCenter placementMatrix

        placeTopic a b =
            { b | cloud = List.map (placeWord sc a) b.cloud }

        placers =
            List.map placeTopic centers
    in
    { current | topics = List.map2 apply placers current.topics }


placePeriods : Model -> Model
placePeriods model =
    let
        place =
            placePeriod (scale model) model.w model.h

        folder y done =
            case List.drop (List.length done - 1) done of
                [] ->
                    [ diff emptyCloudPeriod (place y) ]

                x :: _ ->
                    done ++ [ diff x (place y) ]

        periods =
            List.foldl folder [] model.periods
    in
    { model | periods = periods }


placeWord : Float -> ( Float, Float ) -> PrettyWord -> PrettyWord
placeWord sc ( cx, cy ) word =
    let
        wx =
            scaleTo sc cx

        wy =
            scaleTo sc cy
    in
    { word
        | x = wx word.x
        , y = wy word.y
        , size = word.size * sc
    }


rawPeriods : CloudPeriods
rawPeriods =
    case Dec.decodeString decodeCloudPeriods dataString of
        Ok a ->
            reorder a

        Err _ ->
            []


remainCheck : CloudPeriod -> CloudPeriod -> CloudPeriod
remainCheck current next =
    let
        remains a =
            List.member a.name (List.map .name next.topics)

        check a =
            case remains a of
                True ->
                    { a | fadeOut = False }

                False ->
                    a
    in
    { current
        | topics =
            List.map check current.topics
    }


reorder : CloudPeriods -> CloudPeriods
reorder raw =
    let
        periods =
            sortPeriods raw

        fadeOutCheck ys =
            case ys of
                z :: zs ->
                    List.map2 remainCheck ys (zs ++ [ emptyCloudPeriod ])

                [] ->
                    []
    in
    List.foldl reorderPeriod [] periods
        |> List.reverse
        |> fadeOutCheck


reorderPeriod : CloudPeriod -> CloudPeriods -> CloudPeriods
reorderPeriod current list =
    let
        previous =
            case list of
                x :: xs ->
                    x

                [] ->
                    current

        newcomer a =
            not <| List.member a.name (List.map .name previous.topics)

        newcomers =
            List.filter newcomer current.topics

        justRemainers a =
            case List.filter (\b -> b.name == a.name) current.topics of
                x :: _ ->
                    Just { x | fadeIn = False }

                [] ->
                    Nothing

        remainerList =
            List.map justRemainers previous.topics

        integrateInto a bs =
            case Listx.splitWhen (\x -> x == Nothing) bs of
                Just ( xs, ys ) ->
                    case ys of
                        z :: zs ->
                            xs ++ (Just a :: zs)

                        [] ->
                            xs

                Nothing ->
                    bs
    in
    { current
        | topics =
            List.filterMap identity (List.foldl integrateInto remainerList newcomers)
    }
        :: list


scale : Model -> Float
scale model =
    min (model.w / (4 * cloudSizeOrig.width)) (model.h / (3.3 * cloudSizeOrig.height))


scaleTo factor center point =
    factor * point + center


setFrame : Float -> Float -> Float -> Float -> HSLA -> Frame
setFrame size rotate x y color =
    { size = size
    , rotate = rotate
    , x = x
    , y = y
    , color = color
    }


shift : Int -> List a -> List a
shift n list =
    let
        m =
            case n < 0 of
                True ->
                    List.length list + n

                False ->
                    n
    in
    List.drop m list ++ List.take m list


slider: Int -> Html Msg
slider val =
    Html.node "input"
        [ class "slider is-fullwidth is-medium"
        , Attr.step "1"
        , Attr.min "0"
        , Attr.max "100"
        , Attr.value (String.fromInt val)
        , Attr.type_ "range"
        , style "padding" "8px"
        , Html.Events.onInput Slide
        ]
        []

sliderWithButts : Model -> Html Msg
sliderWithButts model =
    div
        ( class "has-text-centered" :: placeForSlider model )
        [ butt model, slider model.slider ]

sortPeriods : List CloudPeriod -> List CloudPeriod
sortPeriods list =
    let
        sortPeriod a =
            { a | topics = List.sortBy (accentRemove << .name) a.topics }
    in
    List.map sortPeriod list


viewCloudTopic : Model -> ( Float, Float ) -> CloudTopic -> List Renderable
viewCloudTopic model ( cx, cy ) topic =
    let
        fsize =
            12 * model.w / 1600

        ( x, y ) =
            ( cx, cy + scale model * cloudSizeOrig.height * 0.51 )

        animStage =
            animRender model.animation

        opa =
            faderOpacity topic.fadeIn topic.fadeOut model.animation model.kuss
    in
    viewTopicName opa fsize ( x, y ) topic.name
        :: List.map (viewWord model.animation) topic.cloud


viewClouds : Model -> List Renderable
viewClouds model =
    let
        toCenter ( x, y ) =
            ( x * model.w, y * model.h )

        centers =
            List.map toCenter placementMatrix

        toViewer a =
            viewCloudTopic model a

        viewers =
            List.map toViewer centers

        current =
            currentPeriodOf model

        periodName =
            viewPeriodName
                (faderOpacity True True model.animation model.kuss)
                (68 * model.w / 1600)
                ( placeForPeriod model )
                current.id
    in
    List.map2 apply viewers current.topics
        |> List.concat
        |> List.append [ periodName ]


viewPeriodName : Float -> Float -> ( Float, Float ) -> String -> Renderable
viewPeriodName opa fsize ( cx, cy ) txt =
    Canvas.text
        [ Canvas.Settings.fill (opaqueBlack opa)
        , Canvas.Settings.Text.font { size = round fsize, family = fontForTitles }
        , Canvas.Settings.Text.align Canvas.Settings.Text.Center
        ]
        ( cx, cy )
        txt


viewTopicName : Float -> Float -> ( Float, Float ) -> String -> Renderable
viewTopicName opa fsize ( pX, pY ) name =
    Canvas.text
        [ Canvas.Settings.fill (opaqueBlack opa)
        , Canvas.Settings.Text.font { size = round fsize, family = fontForTitles }
        , Canvas.Settings.Text.align Canvas.Settings.Text.Center
        ]
        ( pX, pY )
        name


viewWord : Animation -> PrettyWord -> Renderable
viewWord anim word =
    let
        animStage =
            animRender anim

        noAnimation =
            [ Canvas.Settings.fill (Color.fromHsla word.color)
            , Canvas.Settings.Text.font { size = round word.size, family = fontForCloud }
            , Canvas.Settings.Text.align Canvas.Settings.Text.Center
            , Canvas.Settings.Text.baseLine Canvas.Settings.Text.Middle
            , myRotate word.x word.y (degrees word.rotate)
            ]

        ( maybeAnimate, pos ) =
            case word.startState of
                Just start ->
                    case word.endState of
                        Just end ->
                            let
                                animX =
                                    interpolate start.x end.x animStage

                                animY =
                                    interpolate start.y end.y animStage
                            in
                            ( [ Canvas.Settings.fill (Color.fromHsla <| interpolateColor start.color end.color animStage)
                              , Canvas.Settings.Text.font { size = round (interpolate start.size end.size animStage), family = fontForCloud }
                              , Canvas.Settings.Text.align Canvas.Settings.Text.Center
                              , Canvas.Settings.Text.baseLine Canvas.Settings.Text.Middle
                              , myRotate animX animY (degrees <| interpolate start.rotate end.rotate animStage)
                              ]
                            , ( animX, animY )
                            )

                        Nothing ->
                            ( noAnimation, ( word.x, word.y ) )

                Nothing ->
                    ( noAnimation, ( word.x, word.y ) )
    in
    Canvas.text
        maybeAnimate
        pos
        word.text

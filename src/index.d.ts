/**
 * 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
 *
 * HIGHLY IMPORTANT NOTICE:
 *
 * This is the core file that makes Decentraland scenes retro-compatible,
 * and in which countless developers rely on to build and hack Decentraland.
 *
 * It behaves the same way as POSIX, it exposes the standard library of the
 * Decentraland scenes.
 *
 * This file is append only, that involves a maintainability compromise
 * of _infinite_ time for every thing added to this file.
 *
 * It contains the functions that are present in the global `dcl` object.
 * The whole SDK (and every SDK we come up with for JS) will use this file's
 * definitions, forever. Under the assumption that the interfaces and semantics
 * won't change ever. That is the simple principle in which we base our
 * backwards compatibility plans.
 *
 * The rule of thumb is: don't touch this file, unless agreed on a council
 * of historical developers in an equinox, after a key signing ceremony to
 * verify their identities. In a remote location. During a leap year.
 *
 * The most common and least dangerous thing that could be added to this
 * repository are events from the engine or the runtime (see IEvents).
 *
 * 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
 * @internal
 */
declare type _headerComment = {
  // this type exist to remove the notice from the generated .d.ts bundle
}

/** @public */
export type ModuleDescriptor = {
  rpcHandle: string
  methods: MethodDescriptor[]
}

/** @public */
export type MethodDescriptor = { name: string }

/** @public */
export type ComponentID = string

/** @public */
export type EntityID = string

/** @public */
export type DecentralandInterface = {
  /** are we running in debug mode? */
  DEBUG: boolean

  /** update the entity shape */
  updateEntity?: never

  /** log function */
  log(...a: any[]): void

  /** error function */
  error(message: string | Error, data?: any): void

  /** open external url */
  // TODO: remove from here
  openExternalUrl(url: string): void

  /** open nft info dialog */
  // TODO: remove from here
  openNFTDialog(assetContractAddress: string, tokenId: string, comment: string | null): void

  // LIFECYCLE

  /** update tick */
  onUpdate(cb: (deltaTime: number) => void): void

  /** called when it is time to wake the sandbox */
  onStart(cb: Function): void

  // ENTITIES

  /** create the entity in the engine */
  addEntity(entityId: EntityID): void

  /** remove the entity from the engine */
  removeEntity(entityId: EntityID): void

  /** called after adding a component to the entity or after updating a component */
  updateEntityComponent(entityId: EntityID, componentName: string, classId: number, json: string): void

  /** called after adding a DisposableComponent to the entity */
  attachEntityComponent(entityId: EntityID, componentName: string, componentId: ComponentID): void

  /** called after removing a component from the entity */
  removeEntityComponent(entityId: EntityID, componentName: string): void

  /** set a new parent for the entity */
  setParent(entityId: EntityID, parentId: EntityID): void

  // QUERY

  query(queryType: string, payload: any): void

  // COMPONENTS

  /** called after creating a component in the kernel  */
  componentCreated(componentId: ComponentID, componentName: string, classId: number): void

  /** colled after removing a component from the kernel */
  componentDisposed(componentId: ComponentID): void

  /** called after globally updating a component */
  componentUpdated(componentId: ComponentID, json: string): void

  // EVENTS

  /** event from the engine */
  onEvent(cb: (event: Readonly<EngineEvent>) => void): void

  /** subscribe to specific events, events will be handled by the onEvent function */
  subscribe(eventName: IEventNames): void

  /** unsubscribe to specific event */
  unsubscribe(eventName: IEventNames): void

  // MODULES

  /** load a module */
  loadModule(moduleName: string, exportsRef: any): Promise<ModuleDescriptor>

  /** called when calling a module method */
  callRpc(rpcHandle: string, methodName: string, args: ArrayLike<any>): Promise<any>
}

/// --- PRIMITIVES ---

/** @public */
export type ReadOnlyVector2 = {
  readonly y: number
  readonly x: number
}

/** @public */
export type ReadOnlyVector3 = {
  readonly y: number
  readonly x: number
  readonly z: number
}

/** @public */
export type ReadOnlyVector4 = {
  readonly x: number
  readonly y: number
  readonly z: number
  readonly w: number
}

/** @public */
export type ReadOnlyQuaternion = ReadOnlyVector4

/** @public */
export type InputEventResult = {
  /** Origin of the ray, relative to the scene */
  origin: ReadOnlyVector3
  /** Direction vector of the ray (normalized) */
  direction: ReadOnlyVector3
  /** ID of the pointer that triggered the event */
  buttonId: number
  /** Does this pointer event hit any object? */
  hit?: {
    /** Length of the ray */
    length: number
    /** If the ray hits a mesh the intersection point will be this */
    hitPoint: ReadOnlyVector3
    /** If the mesh has a name, it will be assigned to meshName */
    meshName: string
    /** Normal of the hit */
    normal: ReadOnlyVector3
    /** Normal of the hit, in world space */
    worldNormal: ReadOnlyVector3
    /** Hit entity ID if any */
    entityId: EntityID
  }
}

/** @public */
export type GlobalInputEventResult = InputEventResult & {
  /**
   * DOWN = 0,
   * UP = 1
   */
  type: 0 | 1
}

/** @public */
export type RaycastResponsePayload<T> = {
  queryId: string
  queryType: string
  payload: T
}

/** @public */
export type GizmoDragEndEvent = {
  type: "gizmoDragEnded"
  transforms: Array<{
    position: ReadOnlyVector3
    rotation: ReadOnlyQuaternion
    scale: ReadOnlyVector3
    entityId: EntityID
  }>
}

/** @public */
export type GizmoSelectedEvent = {
  type: "gizmoSelected"
  gizmoType: "MOVE" | "ROTATE" | "SCALE" | "NONE"
  entities: string[]
}

/// --- EVENTS ---

/** @public */
export type IEventNames = keyof IEvents

/** @public */
export type EngineEvent<T extends IEventNames = IEventNames, V = IEvents[T]> = {
  /** eventName */
  type: T
  data: Readonly<V>
}

/**
 * @public
 * Note: Don't use `on` prefix for IEvents to avoid redundancy with `event.on("onEventName")` syntax.
 */
export interface IEvents {
  /**
   * `positionChanged` is triggered when the position of the camera changes
   * This event is throttled to 10 times per second.
   */
  positionChanged: {
    /** Camera position relative to the base parcel of the scene */
    position: ReadOnlyVector3

    /** Camera position, this is a absolute world position */
    cameraPosition: ReadOnlyVector3

    /** Eye height, in meters. */
    playerHeight: number
  }

  /**
   * `rotationChanged` is triggered when the rotation of the camera changes.
   * This event is throttled to 10 times per second.
   */
  rotationChanged: {
    /** Degree vector. Same as entities */
    rotation: ReadOnlyVector3
    /** Rotation quaternion, useful in some scenarios. */
    quaternion: ReadOnlyQuaternion
  }

  /**
   * `cameraModeChanged` is triggered when the user changes the camera mode
   */
  cameraModeChanged: {
    /**
     * FIRST_PERSON = 0,
     * THIRD_PERSON = 1,
     * FREE_CAMERA = 2
     */
    cameraMode: 0 | 1 | 2
  }

  /**
   * `idleStateChanged` is triggered when the user not moves for a defined period of time
   */
  idleStateChanged: {
    isIdle: boolean
  }

  playerExpression: {
    expressionId: string
  }

  /**
   * `pointerUp` is triggered when the user releases an input pointer.
   * It could be a VR controller, a touch screen or the mouse.
   */
  pointerUp: InputEventResult

  /**
   * `pointerDown` is triggered when the user press an input pointer.
   * It could be a VR controller, a touch screen or the mouse.
   */
  pointerDown: InputEventResult

  /**
   * `pointerEvent` is triggered when the user press or releases an input pointer.
   * It could be a VR controller, a touch screen or the mouse.
   *
   * @deprecated use actionButtonEvent instead
   */
  pointerEvent: GlobalInputEventResult

  /**
   * `actionButtonEvent` is triggered when the user press or releases an input pointer.
   * It could be a VR controller, a touch screen or the mouse.
   *
   * This event is exactly the same as `pointerEvent` but the logic in the ECS had an unsolvable
   * condition that required us to create this new event to handle more cases for new buttons.
   */
  actionButtonEvent: GlobalInputEventResult

  /**
   * `raycastResponse` is triggered in response to a raycast query
   */
  raycastResponse: RaycastResponsePayload<any>

  /**
   * `chatMessage` is triggered when the user sends a message through chat entity.
   */
  chatMessage: {
    id: string
    sender: string
    message: string
    isCommand: boolean
  }

  /**
   * `onChange` is triggered when an entity changes its own internal state.
   * Dispatched by the `ui-*` entities when their value is changed. It triggers a callback.
   * Notice: Only entities with ID will be listening for click events.
   */
  onChange: {
    value?: any
    /** ID of the pointer that triggered the event */
    pointerId?: number
  }

  /**
   * `onEnter` is triggered when the user hits the "Enter" key from the keyboard
   * Used principally by the Chat internal scene
   */
  onEnter: {}

  /**
   * `onPointerLock` is triggered when the user clicks the world canvas and the
   * pointer locks to it so the pointer moves the camera
   */
  onPointerLock: {
    locked?: boolean
  }

  /**
   * `onAnimationEnd` is triggered when an animation clip gets finish
   */
  onAnimationEnd: {
    clipName: string
  }

  /**
   * `onFocus` is triggered when an entity focus is active.
   * Dispatched by the `ui-input` and `ui-password` entities when the value is changed.
   * It triggers a callback.
   *
   * Notice: Only entities with ID will be listening for click events.
   */
  onFocus: {
    /** ID of the entitiy of the event */
    entityId: EntityID
    /** ID of the pointer that triggered the event */
    pointerId: number
  }

  /**
   * `onBlur` is triggered when an entity loses its focus.
   * Dispatched by the `ui-input` and `ui-password` entities when the value is changed.
   *  It triggers a callback.
   *
   * Notice: Only entities with ID will be listening for click events.
   */
  onBlur: {
    /** ID of the entitiy of the event */
    entityId: EntityID
    /** ID of the pointer that triggered the event */
    pointerId: number
  }

  /** The onClick event is only used for UI elements */
  onClick: {
    entityId: EntityID
  }

  /**
   * This event gets triggered when an entity leaves the scene fences.
   */
  entityOutOfScene: {
    entityId: EntityID
  }

  /**
   * This event gets triggered when an entity enters the scene fences.
   */
  entityBackInScene: {
    entityId: EntityID
  }

  /**
   * This event gets triggered when the user enters the scene
   */
  onEnterScene: {
    userId: string
  }

  /**
   * This event gets triggered when the user leaves the scene
   */
  onLeaveScene: {
    userId: string
  }

  /**
   * This event gets triggered after receiving a comms message.
   */
  comms: {
    sender: string
    message: string
  }

  /**
   * This is triggered once the scene should start.
   */
  sceneStart: {}

  /**
   * This is triggered once the builder scene is loaded.
   */
  builderSceneStart: {}

  /**
   * This is triggered once the builder scene is unloaded.
   */
  builderSceneUnloaded: {}

  /**
   * After checking entities outside the fences, if any is outside, this event
   * will be triggered with all the entities outside the scene.
   */
  entitiesOutOfBoundaries: {
    entities: string[]
  }

  uuidEvent: {
    uuid: string
    payload: any
  }

  onTextSubmit: {
    text: string
  }

  metricsUpdate: {
    given: Record<string, number>
    limit: Record<string, number>
  }

  limitsExceeded: {
    given: Record<string, number>
    limit: Record<string, number>
  }

  /** For gizmos */
  gizmoEvent: GizmoDragEndEvent | GizmoSelectedEvent

  externalAction: {
    type: string
    [key: string]: any
  }

  stateEvent: {
    type: string
    payload: any
  }

  /** This is triggered at least for each videoStatus change */
  videoEvent: {
    componentId: string
    videoClipId: string
    /** Status, can be NONE = 0, ERROR = 1, LOADING = 2, READY = 3, PLAYING = 4,BUFFERING = 5 */
    videoStatus: number
    /** Current offset position in seconds */
    currentOffset: number
    /** Video length in seconds. Can be -1 */
    totalVideoLength: number
  }

  /** This is trigger everytime a profile is changed */
  profileChanged: {
    ethAddress: string
    version: number
  }

  /** Triggered when peer's avatar is connected and visible */
  avatarConnected: {
    userId: string
  }

  /** Triggered when peer disconnect and/or it avatar is set invisible by comms */
  avatarDisconnected: {
    userId: string
  }
}

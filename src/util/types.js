// @flow
/* global HTMLImageElement */

export type Cancel = void => mixed
export type CreepyImage = HTMLImageElement & {
    creepyFaceCancel?: Cancel,
    creepyFaceReachableImages?: Array<HTMLImageElement>
}

// @flow
/* global HTMLImageElement */

export type Cancel = void => mixed
export type CreepyImage = HTMLImageElement & {
    creepyFaceReachableImages?: Array<HTMLImageElement>
}

// @flow
/* global HTMLImageElement */

export type Cancel = void => mixed
export type CreepyImage = HTMLImageElement & {
    creepyfaceCancel?: Cancel,
    creepyfaceReachableImages?: Array<HTMLImageElement>
}

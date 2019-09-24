import {darkGrey, lightGrey, red} from '../constants'

export function getCellColor({x,y, focus}) {
    if(focus)
      return red
    if((x % 2 === 1 && y % 2 === 1) || (x % 2 === 0 && y % 2 === 0))
      return darkGrey
    return lightGrey
}
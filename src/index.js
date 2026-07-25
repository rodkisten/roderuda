/* global BUILD_INFO */
import roderuda from './roderuda'

if(typeof roderuda !== "undefined"){
 window.RodEruda = roderuda;
}
console.log('🪅🪄 RodEruda installed! ', BUILD_INFO)

export default roderuda

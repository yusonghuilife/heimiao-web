import { clsPrefix } from "../const";

export const CustomIcon = ({ src } : {src : string}) =>
<img
  style={{ width: '16px', height: '16px' }}
  src={src}
  className={`${clsPrefix}-icon`}
/>

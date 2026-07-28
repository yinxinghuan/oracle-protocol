import alteruSrc from '../img/alteru.svg'

export default function Watermark() {
  return (
    <img
      className="op__watermark"
      src={alteruSrc}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  )
}

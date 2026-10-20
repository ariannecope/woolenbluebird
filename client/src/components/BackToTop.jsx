import './BackToTop.css'

function BackToTop() {
  function handleClick() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      className="back-to-top"
      onClick={handleClick}
      aria-label="Back to top"
    />
  )
}

export default BackToTop

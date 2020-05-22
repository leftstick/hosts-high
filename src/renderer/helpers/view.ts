export function destoryGlobalSpinner() {
  const splash = document.querySelector('#splash-spinner')
  const spinner = document.querySelector('.spinner')
  if (splash) {
    document.head.removeChild(splash)
  }
  if (spinner && spinner.parentNode) {
    spinner.parentNode.removeChild(spinner)
  }
}

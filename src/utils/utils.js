function throttle(method, delay = 30) {
  let timer = null;
  return function() {
    if (timer) return;
    const args = arguments;
    timer = setTimeout(() => {
      method.apply(this, args);
      timer = null;
    }, delay);
  }
}

export {
  throttle
};
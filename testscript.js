const logger = (val) => {
  console.log(val);
};

const counter = (num) => {
  for (let i = 0; i < num; i++) {
    setTimeout(logger, 300 * i, i + ' building');
  }
};

counter(20);

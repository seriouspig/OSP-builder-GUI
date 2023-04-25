const logger = (val) => {
    console.log(val)
}

const counter = (num) => {
    for (let i=0; i<num; i++) {
        setTimeout(logger, 1000 * i, i + " building")
    }
}

counter(10)
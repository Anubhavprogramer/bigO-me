function testTheExtension(a) {
    for(let i = 0; i < a; i++) {
        for(let j = 0; j < a; j++) {
            console.log(i, j);
        }
    }
}

testTheExtension(5);
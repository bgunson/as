if (process.env.NODE_ENV === 'test') {
    console.log = () => {}  // suppress logs    
}

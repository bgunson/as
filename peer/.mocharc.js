if (process.env.NODE_ENV === 'test') {
    console.log = () => {}  // suppress logs    
}

process.env.AD_DIR = 'ads/test';
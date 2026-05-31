const formatTime = (date) => {
    return new Date(+new Date(new Date(date).toJSON()) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '');
};

export default formatTime;

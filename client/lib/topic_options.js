function TopicOptions(host, path, method, serverKey) {
    this.topicOptions = {
        host,
        path,
        method,
        json: true,
        headers: { }
    };

    this.topicOptions.headers = {
        'Host': TopicOptions.host,
        'Authorization': 'key=' + serverKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    return TopicOptions;
}

export default TopicOptions;
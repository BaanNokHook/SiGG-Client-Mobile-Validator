function TopicData(topicName, registration_tokens) {
    return {
        to: `/topics/${topicName}`,
        registration_tokens
    };
}

export default TopicData;
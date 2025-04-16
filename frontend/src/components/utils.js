export function isPastExam(dateStr) {
    const today = new Date();
    const examDate = new Date(dateStr);
    return examDate < today.setHours(0, 0, 0, 0);
}

export function getDaysRemaining(dateStr) {
    const today = new Date();
    const examDate = new Date(dateStr);
    const diffTime = examDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function handleDate(DATE){
    return DATE.split('T')[0];
}
import { Timestamp } from "firebase/firestore";


export function convertDateFirestore(data: Timestamp) {

    if (data instanceof Timestamp) {
        const dateConverted = data.toDate();
        return dateConverted
    }
}

export const formatDate = (date: Date | undefined) => {
    if (!date) return 'Data inválida';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
};

export const extractTextAfterReference = (text: string) => {
    const cleanedText = text.replace('passagembiblic', '').trim();
    const splitText = cleanedText.split(' - ');
    return splitText.length > 1 ? splitText[1] : cleanedText;
};
import { Timestamp } from "firebase/firestore";


export function convertDateFirestore(data: Timestamp) {

    if (data instanceof Timestamp) {
        const dateConverted = data.toDate();
        return dateConverted
    }
}
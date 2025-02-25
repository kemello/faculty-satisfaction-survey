// export class ProfessorService {
//     static async getProfessors() {
//         try {
//             const response = await fetch('http://localhost:8080/api/professors', {
//                 method: 'POST',
//                 headers: {'Content-Type': 'application/json'},
//                 body: JSON.stringify({
//                     faculty: "COMPUTER_SCIENCE",
//                     academicYear: "THIRD_YEAR",
//                     studyMode: "FULL_TIME"
//                 })
//             });
//             if (!response.ok) throw new Error('Failed to fetch');
//             return await response.json();
//         } catch (error) {
//             console.error('Error fetching professors:', error);
//             return []; // Return empty array as fallback
//         }
//     }
// }

export const ProfessorService = {
    getProfessors: () => {
        return [
            {
                "users": [
                    {
                        "id": 0,
                        "name": "Amy Elsner",
                        "image": "amyelsner.png"
                    },
                    {
                        "id": 1,
                        "name": "Anna Fali",
                        "image": "annafali.png"
                    },
                    {
                        "id": 2,
                        "name": "Asiya Javayant",
                        "image": "asiyajavayant.png"
                    },
                    {
                        "id": 3,
                        "name": "Bernardo Dominic",
                        "image": "bernardodominic.png"
                    },
                    {
                        "id": 4,
                        "name": "Elwin Sharvill",
                        "image": "elwinsharvill.png"
                    },
                    {
                        "id": 5,
                        "name": "Elwin Sharvill",
                        "image": "elwinsharvill.png"
                    }
                ]
            }
        ]
    }
}
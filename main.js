async function process_argv() {
    let { argv } = process;
    argv = argv.slice(2);
    const result = await studentActivitiesRegistration(argv);

    return result;
}

/// Semua fungsi pakai cara async await default dari assigment =====================================
async function getStudentActivities() {
    try {
        const response = await fetch('http://localhost:3001/activities');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

// PAKAI PROMISE
// function getStudentActivities(){
//     //membuat promise baru 
//     return new Promise((resolve, reject) => {
//         //mengirim request ke endpoint "/activities" menggunakan metode get
//         return fetch('http://localhost:3001/activities')
//         //mengembalikan respon dalam bentuk JSON
//         .then(response => response.json())
//         //jika berhasil = resolve dengan pesannya
//         .then(data => resolve(data))
//         //jika erorr = reject dengan pesannya
//         .catch(error => reject(error));
//     })
// }

/// PROGRAM DEFAULT 2===================================================================
async function studentActivitiesRegistration(data) {
    const method = data[0];
    if (method === 'CREATE') {
        const name = data[1];
        const day = data[2];
        try {
            const student = await addStudent(name, day);
            return student;
        } catch (error) {
            console.error(error);
        }
    } else if (method === 'DELETE') {
        const id = data[1];
        try {
            await deleteStudent(id);
            return { message: `Successfully deleted student data with id ${id}` };
        } catch (error) {
            console.error(error);
        }
    } else {
        return;
    }
}

// PAKAI PROMISE ifnya masih sama tinggal diubah pake promise
// function studentActivitiesRegistration(data) {
//         const method = data[0];
//         if (method === 'CREATE') {
//             const name = data[1];
//             const day = data[2];
//             //diganti dengan promise. kita buat promise baru
//             return new Promise((resolve, reject) => {
//                 // pannggil fungsi addStudent dengan parameternya
//                 addStudent(name,day)
//                     .then(student => {
//                         //jika berhasil dibuat, resolve dengan message sukses
//                         resolve(student)
//                     })
//                     .catch(error => {
//                         //jika gagal. reject pesan error
//                         reject(error)
//                     });
//             });

//             //
//         } else if (method === 'DELETE') {
//             const id = data[1];
//             //buat promise
//             return new Promise((resolve, reject) => {
//                 //sekarang ppanggil fungsi delete dengan paremeternya = id
//                 deleteStudent(id)
//                 .then(() => {
//                     //jika berhasil = resolve
//                     resolve({ message: `Successfully deleted student data with id ${id}` });
//                 })
//                 .catch(error => {
//                     //jika gagal = reject
//                     reject(error);
//                 });
//             })
//         } else {
//             return;
//         }
//     }

//PROGRAM DEFAULT 3==================================================================================
async function addStudent(name, day) {
    try {
        const activities = await getStudentActivities();
        const filteredActivities = activities.filter(activity => activity.days.includes(day));
        const data = {
            name: name,
            activities: filteredActivities.map(activity => ({ name: activity.name, desc: activity.desc })),
        };
        const createResponse = await fetch('http://localhost:3001/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const studentData = await createResponse.json();
        const result = {
            id: studentData.id,
            name: studentData.name,
            activities: data.activities,
        };
        return result;
    } catch (error) {
        console.error(error);
    }
}

//PAKE PROMISE
// function addStudent(name, day) {
//     //buat promise baru
//     return new Promise((resolve, reject) => {
//         //panggil method getStudentActivities() ntuk mengambil daftar kegiatan mahasiswa dari server
//         getStudentActivities()
//         .then(activities => {
//             //panggil kegiatan yang sedang dijalankan pada hari yg dimaksud
//             const filteredActivities = activities.filter(activity => activity.days.includes(day));
//             //buat data mahasiswa baru
//             const data = {
//                 name: name,
//                 activities: filteredActivities.map(activity => ({name: activity.name, desc: activity.desc})),
//             };
//             //mengirim data mahasiswa baru ke server
//             fetch('http://localhost:3001/students', {
//             method: 'POST',
//             headers: {
//             'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data),
//             })
//             .then(response => response.json())
//             .then(studentData => {
//               //membuat objek baru untuk data mahasiswa yang sudah terdaftar
//             const result = {
//                 id: studentData.id,
//                 name: studentData.name,
//                 activities: data.activities,
//             };
//               resolve(result); //menyelesaikan promise dengan mengembalikan data mahasiswa yang sudah terdaftar
//             })
//             .catch(error => reject(error)); //menolak promise dengan memberikan pesan error jika terjadi kesalahan saat mengirim data ke server
//         })
//         .catch(error => reject(error)); //menolak promise dengan memberikan pesan error jika terjadi kesalahan saat mengambil data dari server
//     });
// }



//PROGRAM DEFAULT 4==============================================================================
async function deleteStudent(id) {
    try {
        const response = await fetch(`http://localhost:3001/students/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // console.log(`response.ok`, response.ok)
        // console.log(await response.json())
        //sebelumnya salah ada 2 return erorr
        return { message: `Successfully deleted student data with id ${id}` };
        
    } catch (error) {
        console.error(error);
    }

}
// console.log(deleteStudent(1))

//PAKE PROMISE 
// function deleteStudent(id) {
//     ///membuat Promise 
//     return new Promise((resolve, reject) => {
//         //kirim request endpoint //students//id dengan metode DELETE
//         fetch(`http://localhost:3001/students/${id}`, {
//             method: `DELETE`,
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         })
//         // cek jika resppon yang diterima dari server bernilai ok atau true akan return
//         //jika berhasil = resolve dengan pesannya
//         .then(response => resolve({ message: `Successfully deleted student data with id ${id}` }))
//         //jika error = reject dengan pesannya
//         .catch(error => reject(error));
//     });
// }



process_argv()
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = {
    studentActivitiesRegistration,
    getStudentActivities,
    addStudent,
    deleteStudent
};

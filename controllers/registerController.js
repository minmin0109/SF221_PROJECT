module.exports = (req , res) => {
    let email = ""
    let password = ""
    // ดึงข้อมูลจาก flash message ชื่อ'data'
    //flash มักจะใช้ร่วมกับ express-session เพื่อเก็บข้อมูลชั่วคราวที่ต้องการให้ถูกส่งไปยังหน้าถัดไป และหลังจากนั้นจะถูกลบทิ้งไปเมื่อถึงหน้าถัดไป
    let data = req.flash('data')[0]

    // ตรวจสอบว่าข้อมูลถูกกำหนดค่าไหม
    if (typeof data != "undefined") {
        email = data.email
        password = data.password
    }
    res.render('register' , {
        errors: req.flash('validationErrors'),
        email: email , 
        password: password
    })
}
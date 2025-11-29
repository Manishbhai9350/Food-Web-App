import multer, {memoryStorage} from 'multer';



const storage = multer({
    storage:memoryStorage()
})

export {
    storage as MulterStorage
}
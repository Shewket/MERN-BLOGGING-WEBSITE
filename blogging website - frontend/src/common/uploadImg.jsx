import axios from "axios";


const uploadImage = async (img) => {
        const files = img.target.files;
        const data = new FormData();
    
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        
        return await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/blog/upload', data, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(res => {
            return res.data;
        })

    
}

export default uploadImage;
import axios from "axios";


const uploadImage = async (img) => {

        const data = new FormData();
  

        // Banner
        if (img.target){
            const files = img.target.files
            for (let i = 0; i < files.length; i++) {
                data.append('photos', files[i]);
            }
        }
        else {
            data.append('photos', img);
        }


       
        return await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/blog/upload', data, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(res => {
            let url = import.meta.env.VITE_SERVER_DOMAIN + '/' + res.data[0]
            return url;
        })

    
}

export default uploadImage;
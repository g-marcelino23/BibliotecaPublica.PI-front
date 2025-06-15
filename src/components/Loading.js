import styles from '../styles/Loading.css'
import loading from '../assets/image/loading.svg'

function Loading(){
    return(
        <div className={styles.loader_container}>
            <img className={styles.loader} src={loading} alt="Loading"/>
        </div>
    )
}

export default Loading

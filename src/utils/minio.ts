import * as Minio from 'minio';
// This code initializes a MinIO client to connect to a MinIO server.
const globalForMinio = global as unknown as {
    minio: Minio.Client
}

const minio = globalForMinio.minio || new Minio.Client({
    endPoint: 'kisaragi.fbk',
    port: 9000,
    useSSL: false,
    accessKey: 'KISARAGI',
    secretKey: 'kisaragiStorage',
})

if (process.env.NODE_ENV !== 'production') globalForMinio.minio = minio;

export default minio;
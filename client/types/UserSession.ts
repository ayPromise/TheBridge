export default interface UserSession{
    id: number,
    documentId: string,
    username: string,
    email: string,
    provider?: "github" | "google",
    confirmed: boolean,
    blocked: boolean,
    createdAt: Date,
    updatedAt: Date,
    publishedAt: Date
}
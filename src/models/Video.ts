export class Video {
    constructor(
        private id: string,
        private title: string,
        private duration: number,
        private uploadDate: string
    ){}

        public getId(): string{
            return this.id
        }
        public setId(newId:string): void{
            this.id = newId 
        }

        public getTitle(): string{
            return this.title
        }
        public setTitle(newTitle:string): void{
            this.title = newTitle
        }

        public getDuration(): number{
            return this.duration
        }
        public setDuration(newDuration:number){
            this.duration = newDuration
        }

        public getUploadDate(): string{
            return this.uploadDate
        }
        public setUploadDate(newUploadDate:string): void{
            this.uploadDate = newUploadDate
        }



}
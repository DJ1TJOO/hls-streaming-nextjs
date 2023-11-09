import FileUpload from "./_components/FileUpload";
import FilesProvider from "./_components/FilesProvider";
import VideoUploads from "./_components/VideoUploads";

export default function Page() {
    return (
        <FilesProvider>
            <VideoUploads />
            <FileUpload />
        </FilesProvider>
    );
}

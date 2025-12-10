import {type FormEvent, useEffect, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
        const [error, setError] = useState('');

    useEffect(() => {
        setError('');
    }, [file]);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
               setError('');
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');

        setStatusText('Converting to image...');
        const imageFile = await convertPdfToImage(file);
        if(!imageFile.file) return setStatusText('Error: Failed to convert PDF to image');

        try {
            setStatusText('Uploading your resume & generating preview...');
            const [uploadedFile, imageFile] = await Promise.all([
                fs.upload([file]),
                convertPdfToImage(file)
            ]);

            if(!uploadedFile) throw new Error('Failed to upload the resume file');
            if(!imageFile.file) throw new Error('Failed to convert the PDF to an image');

            setStatusText('Saving your preview...');
            const uploadedImage = await fs.upload([imageFile.file]);
            if(!uploadedImage) throw new Error('Failed to upload the preview image');

            setStatusText('Preparing your analysis...');
            const uuid = generateUUID();
            const data: Resume = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: null,
                status: 'processing'
            }
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            navigate(`/resume/${uuid}`);
            setStatusText('Analyzing your resume with AI...');

            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({ jobTitle, jobDescription })
            )
            if (!feedback) throw new Error('Failed to analyze resume');

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : feedback.message.content[0].text;

            data.feedback = JSON.parse(feedbackText);
            data.status = 'complete';
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
            setStatusText('');
            setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        
        }
            
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

            if(!companyName || !jobTitle || !jobDescription || !file) {
            setError('Please fill in all fields and upload your resume before continuing.');
            return;
        }

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                                        {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                            {error}
                        </p>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                   <input type="text" name="company-name" placeholder="Company Name" id="company-name" required />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                          <input type="text" name="job-title" placeholder="Job Title" id="job-title" required />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                           <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" required />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                  <button className="primary-button disabled:opacity-60" type="submit" disabled={!file}>
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload

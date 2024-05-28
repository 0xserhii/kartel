import { toast } from "react-toastify";


const useToast = () => {
  const success = (content: string) => toast.success(<SuccessToast content={content} />)
  const error = (content: string) => toast.error(<ErrorToast content={content} />)
  return {
    success, error
  }
}

export const SuccessToast = ({ content }: { content: string }) => {
  return (
    <div className="flex-row gap-2" >
      <div className="text-sm whitespace-nowrap text-white d-flex align-items-center text-nowrap px-2" style={{ fontSize: '.9rem' }
      }>
        {content}
      </div>
    </div>
  );
}

export const ErrorToast = ({ content }: { content: string }) => (
  <div className="flex-row gap-2" >
    <div className="text-sm whitespace-nowrap text-white d-flex align-items-center text-nowrap px-2" style={{ fontSize: '.9rem' }}>
      {content}
    </div>
  </div>
)


export default useToast
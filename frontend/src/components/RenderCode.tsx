import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'

function RenderCode() {
    const fullCode = useSelector((state: RootState) => state.compilerSlice.fullCode)
    const combinedCode = `<html>${fullCode.html}<style>${fullCode.css}</style><script>${fullCode.javascript}</script></html>`

    const iframeCode = `data:text/html;charset=utf-8,${encodeURIComponent(combinedCode)}`

    return (
        <div className='bg-white w-full h-full'>
            <iframe className='w-full h-full' src={iframeCode}/>
        </div>
    )
}

export default RenderCode
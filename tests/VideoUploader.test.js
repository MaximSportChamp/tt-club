import { render } from '@testing-library/vue'
import VideoUploader from '@/components/common/VideoUploader.vue'

describe('VideoUploader', () => {
  it('renders upload step and matches snapshot', () => {
    const { getByRole } = render(VideoUploader)
    const button = getByRole('button', { name: 'Далее' })
    expect(button.textContent).toMatchInlineSnapshot(`"Далее"`)
  })
})

import { render } from '@testing-library/vue'
import { createPinia } from 'pinia'
import ChallengeCard from '@/components/ChallengeCard.vue'

describe('ChallengeCard', () => {
  it('renders title and matches snapshot', () => {
    const challenge = {
      id: 1,
      title: 'Test Challenge',
      description: 'Desc',
      participants: 10,
      views: 20,
      likes: 5,
      videoUrl: '',
    }

    const { getByText, container } = render(ChallengeCard, {
      global: { plugins: [createPinia()] },
      props: { challenge },
    })

    getByText('Test Challenge')

    expect(container.querySelector('h3')?.outerHTML).toMatchInlineSnapshot(`
      "<h3 class=\"text-xl font-semibold mb-2\">Test Challenge</h3>"
    `)
  })
})

// простой реактивный отсчёт до даты (ISO или Date)
// пример: const { text, isOver } = useCountdown(() => challenge.value?.voteEndsAt)
import { computed, onBeforeUnmount, onMounted, Ref, ref } from 'vue'

type MaybeRef<T> = T | Ref<T>

export function useCountdown(endInput: MaybeRef<string | Date | null | undefined>) {
  const now = ref(Date.now())
  let t: any = null

  const endMs = computed(() => {
    const v = (typeof endInput === 'function' ? (endInput as any)() : (endInput as any)?.value ?? endInput)
    if (!v) return 0
    const ms = typeof v === 'string' || v instanceof Date ? new Date(v).getTime() : 0
    return isFinite(ms) ? ms : 0
  })

  const msLeft = computed(() => Math.max(0, endMs.value - now.value))
  const isOver  = computed(() => endMs.value > 0 && msLeft.value <= 0)

  const days    = computed(() => Math.floor(msLeft.value / 86400000))
  const hours   = computed(() => Math.floor((msLeft.value % 86400000) / 3600000))
  const minutes = computed(() => Math.floor((msLeft.value % 3600000) / 60000))
  const seconds = computed(() => Math.floor((msLeft.value % 60000) / 1000))

  const shortLeft = computed(() => {
    if (!endMs.value) return ''
    if (isOver.value) return 'завершено'
    const chunks = []
    if (days.value) chunks.push(`${days.value}д`)
    chunks.push(`${hours.value}ч`, `${minutes.value}м`)
    return chunks.join(' ')
  })

  const endDateText = computed(() => {
    if (!endMs.value) return ''
    const d = new Date(endMs.value)
    return d.toLocaleDateString()
  })

  const text = computed(() => {
    if (!endMs.value) return ''
    return isOver.value ? 'завершено' : `до ${endDateText.value} · ${shortLeft.value}`
  })

  onMounted(() => { t = setInterval(() => (now.value = Date.now()), 1000) })
  onBeforeUnmount(() => { if (t) clearInterval(t) })

  return { text, shortLeft, endDateText, isOver, days, hours, minutes, seconds, msLeft }
}

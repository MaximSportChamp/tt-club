export const isVotingOpen = (ch?: { voteEndsAt?: string|Date|null }) =>
  !ch?.voteEndsAt || Date.now() < new Date(ch.voteEndsAt).getTime()

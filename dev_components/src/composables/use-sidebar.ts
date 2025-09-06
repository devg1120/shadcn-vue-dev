import {
  BadgeHelp,
  BellDot,
  Boxes,
  Bug,
  CreditCard,
  LayoutDashboard,
  ListTodo,
  Palette,
  Podcast,
  SquareUserRound,
  User,
  Users,
  FileText,
  Apple,
} from 'lucide-vue-next'

import type { NavGroup } from '@/components/app-sidebar/types'

export function useSidebar() {
  const navData = ref<NavGroup[]>()

  navData.value = [
    {
      title: 'common.general',
      items: [
        {
          title: 'common.sample1',    //GUSA
          url: '/sample1',
          icon: Apple,
        },
        {
          title: 'common.sample2',    //GUSA
          url: '/sample2',
          icon: Apple,
        },
      ],
    },
  ]

  return {
    navData,
  }
}

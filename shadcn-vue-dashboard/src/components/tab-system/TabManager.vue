<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import TabBar from './TabBar.vue'
import type { TabItem } from './TabBar.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// 
let isNavigating = false

// 
const routeComponentMap: Record<string, string> = {
  '/sample1': 'Sample1Page',           // GUSA
  '/sample2': 'Sample2Page',           // GUSA
  '/dashboard': 'DashboardPage',
  '/tasks': 'TasksPage',
  '/users': 'UsersPage',
  '/settings': 'SettingsPage',
  '/settings/account': 'SettingsAccountPage',
  '/settings/appearance': 'SettingsAppearancePage',
  '/settings/notifications': 'SettingsNotificationsPage',
  '/settings/display': 'SettingsDisplayPage',
  '/settings/profile': 'SettingsProfilePage',
  '/apps': 'AppsPage',
  '/ai-talk': 'AiTalkPage',
  '/billing': 'BillingPage',
  '/help-center': 'HelpCenterPage',
  '/marketing': 'MarketingPage',
  '/marketing/hello': 'MarketingHelloPage',
}

//
const cachedComponents = ref<string[]>([])

//
function getComponentName(path: string): string {
  return routeComponentMap[path] || `Page_${generateTabId(path)}`
}

//
function addToCache(path: string) {
  const componentName = getComponentName(path)
  if (!cachedComponents.value.includes(componentName)) {
    cachedComponents.value.push(componentName)
    console.log('添加到缓存:', componentName, 'for', path)
  }
}

function removeFromCache(path: string) {
  const componentName = getComponentName(path)
  const index = cachedComponents.value.indexOf(componentName)
  if (index > -1) {
    cachedComponents.value.splice(index, 1)
    console.log('从缓存移除:', componentName, 'for', path)
  }
}

function refreshPage(path: string) {
  removeFromCache(path)
  // 在下一个tick重新添加，强制重新加载
  nextTick(() => {
    addToCache(path)
  })
}



//
function generateTabId(path: string): string {
  return path.replace(/\//g, '-').replace(/^-/, '') || 'home'
}

//
function getPageTitle(path: string): string {
  const titleMap: Record<string, string> = {
    '/tasks': t('common.tasks'),
    '/users': t('common.users'),
    '/sample1': t('common.sample1'),               //GUSA
    '/sample2': t('common.sample2'),               //GUSA
    '/settings': t('common.settings'),
    '/settings/account': t('common.account'),
    '/settings/appearance': t('common.appearance'),
    '/settings/notifications': t('common.notifications'),
    '/settings/display': t('common.display'),
    '/settings/profile': t('common.profile'),
    '/apps': t('common.apps'),
    '/ai-talk': t('common.aiTalk'),
    '/billing': t('common.billing'),
    '/help-center': t('common.helpCenter'),
    '/marketing': t('common.marketing'),
    '/marketing/hello': t('common.welcome'),
    '/example/vditor': t('common.vditor')
  }

  return titleMap[path] || t('common.newPage')
}

//
function createDashboardTab(): TabItem {
  return {
    id: 'dashboard',
    title: t('common.dashboard'),
    path: '/dashboard',
    closable: false
  }
}

//
function createNewTab(path: string): TabItem {
  return {
    id: generateTabId(path),
    title: getPageTitle(path),
    path: path,
    closable: true
  }
}

//
function updateAllTabTitles() {
  tabs.value.forEach(tab => {
    if (tab.path === '/dashboard') {
      tab.title = t('common.dashboard')
    } else {
      tab.title = getPageTitle(tab.path)
    }
  })
}

//
function initializeTabs(): TabItem[] {
  const currentPath = route.path
  const tabs: TabItem[] = [createDashboardTab()]
  
  // 如果当前路由不是仪表盘，添加当前路由标签
  if (currentPath !== '/dashboard') {
    const newTab = createNewTab(currentPath)
    tabs.push(newTab)
  }
  
  return tabs
}

//
function initializeActiveTab(tabsList: TabItem[]): string {
  const currentPath = route.path
  
  //
  const currentTab = tabsList.find(tab => tab.path === currentPath)
  return currentTab ? currentTab.id : 'dashboard'
}

//
const tabs = ref<TabItem[]>(initializeTabs())
const activeTab = ref(initializeActiveTab(tabs.value))

//
watch(activeTab, (newActiveTab, oldActiveTab) => {
  console.log('活动标签变化:', oldActiveTab, '->', newActiveTab)
  
  const tab = tabs.value.find(t => t.id === newActiveTab)
  if (tab && route.path !== tab.path) {
    console.log('路由跳转到:', tab.path)
    isNavigating = true
    router.push(tab.path).finally(() => {
      isNavigating = false
    })
  }
})

//
watch(
  () => route.path,
  (newPath, oldPath) => {
    if (isNavigating) {
      return
    }

    console.log('路由从', oldPath, '变化到', newPath)
    console.log('当前标签列表:', tabs.value.map(t => ({ id: t.id, path: t.path, title: t.title })))

    //
    const existingTab = tabs.value.find(tab => tab.path === newPath)
    if (existingTab) {
      //
      console.log('找到已存在的标签:', existingTab.id)
      activeTab.value = existingTab.id
    } else {
      //
      const newTab = createNewTab(newPath)
      console.log('创建新标签:', newTab)
      tabs.value.push(newTab)
      activeTab.value = newTab.id
      
      //
      if (newPath !== '/dashboard') {
        addToCache(newPath)
      }
    }
    
    console.log('更新后的标签列表:', tabs.value.map(t => ({ id: t.id, path: t.path, title: t.title })))
  },
  { immediate: false }
)

//
const currentLocale = computed(() => t('common.dashboard'))

//
watch(currentLocale, () => {
  updateAllTabTitles()
}, { immediate: false })

//
function handleCloseTab(tabId: string) {
  const tabIndex = tabs.value.findIndex(tab => tab.id === tabId)
  if (tabIndex === -1) return

  const closedTab = tabs.value[tabIndex]
  
  //
  if (closedTab.path !== '/dashboard') {
    removeFromCache(closedTab.path)
  }
  
  //
  tabs.value.splice(tabIndex, 1)

  //
  if (activeTab.value === tabId) {
    const nextTab = tabs.value[tabIndex] || tabs.value[tabIndex - 1] || tabs.value[0]
    if (nextTab) {
      activeTab.value = nextTab.id
    }
  }
  
  console.log('关闭标签:', closedTab.title)
}

// 
function closeAllTabs() {
  //
  cachedComponents.value = []
  
  const dashboardTab = tabs.value.find(tab => tab.path === '/dashboard')
  tabs.value = dashboardTab ? [dashboardTab] : [createDashboardTab()]
  activeTab.value = 'dashboard'
  console.log('关闭所有标签')
}

//
function closeRightTabs(tabId: string) {
  const tabIndex = tabs.value.findIndex(tab => tab.id === tabId)
  if (tabIndex === -1) return

  //
  const removedTabs = tabs.value.splice(tabIndex + 1)
  
  //
  removedTabs.forEach(tab => {
    if (tab.path !== '/dashboard') {
      removeFromCache(tab.path)
    }
  })
  
  //
  if (!tabs.value.find(tab => tab.id === activeTab.value)) {
    activeTab.value = tabs.value[tabs.value.length - 1]?.id || 'dashboard'
  }
  
  console.log('关闭右侧标签:', removedTabs.map(t => t.title))
}

// 
function closeOtherTabs(tabId: string) {
  const targetTab = tabs.value.find(tab => tab.id === tabId)
  if (!targetTab) return

  // 
  const dashboardTab = tabs.value.find(tab => tab.path === '/dashboard')
  const tabsToKeep: TabItem[] = []
  
  if (dashboardTab && targetTab.id !== 'dashboard') {
    tabsToKeep.push(dashboardTab, targetTab)
  } else {
    tabsToKeep.push(targetTab)
  }
  
  //
  const tabsToRemove = tabs.value.filter(tab => !tabsToKeep.includes(tab))
  tabsToRemove.forEach(tab => {
    if (tab.path !== '/dashboard') {
      removeFromCache(tab.path)
    }
  })
  
  tabs.value = tabsToKeep
  activeTab.value = tabId
  
  console.log('关闭其他标签，保留:', tabsToKeep.map(t => t.title))
}

// 
function handleRefreshTab(tabId: string) {
  const tab = tabs.value.find(t => t.id === tabId)
  if (tab && tab.path !== '/dashboard') {
    refreshPage(tab.path)
    console.log('刷新标签:', tab.title)
  }
}



// 
onMounted(async () => {
  await nextTick()
  
  const dashboardTab = tabs.value.find(tab => tab.path === '/dashboard')
  if (!dashboardTab) {
    tabs.value.unshift(createDashboardTab())
  }
  
  // 
  const currentPath = route.path
  const currentTabForPath = tabs.value.find(tab => tab.path === currentPath)
  if (currentTabForPath && activeTab.value !== currentTabForPath.id) {
    activeTab.value = currentTabForPath.id
  }
  
  // 
  if (currentPath !== '/dashboard') {
    addToCache(currentPath)
  }
  
  console.log('TabManager 已挂载，当前标签:', tabs.value.map(t => ({ id: t.id, path: t.path, title: t.title })))
  console.log('当前活动标签:', activeTab.value)
  console.log('初始缓存列表:', cachedComponents.value)
})

// 
onUnmounted(() => {
  console.log('TabManager 组件卸载')
})
</script>

<template>
  <div class="flex flex-col h-full min-h-0">
    <TabBar class="pl-2 pr-2 pb-1" :tabs="tabs" :active-tab="activeTab" @update:active-tab="activeTab = $event" @close-tab="handleCloseTab"
      @close-all="closeAllTabs" @close-right="closeRightTabs" @close-other="closeOtherTabs" @refresh-tab="handleRefreshTab" />
    <div class="flex-1 overflow-hidden min-h-0 p-1">
      <!-- 使用 keep-alive 缓存页面组件 -->
      <keep-alive :include="cachedComponents">
        <div class="h-full overflow-y-auto px-4">
          <router-view />
        </div>
      </keep-alive>
    </div>
  </div>
</template>

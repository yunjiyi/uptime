import { MaintenanceConfig, MonitorTarget } from '@/types/config'
import { Center, Container, Title, Collapse, Button, Box } from '@mantine/core'
import { IconCircleCheck, IconAlertCircle, IconPlus, IconMinus } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import MaintenanceAlert from './MaintenanceAlert'
import { pageConfig } from '@/uptime.config'
import { useTranslation } from 'react-i18next'

function useWindowVisibility() {
  const [isVisible, setIsVisible] = useState(true)
  useEffect(() => {
    const handleVisibilityChange = () => setIsVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])
  return isVisible
}

export default function OverallStatus({
  state,
  maintenances,
  monitors,
}: {
  state: { overallUp: number; overallDown: number; lastUpdate: number }
  maintenances: MaintenanceConfig[]
  monitors: MonitorTarget[]
}) {
  const { t } = useTranslation('common')
  let group = pageConfig.group
  let groupedMonitor = (group && Object.keys(group).length > 0) || false

  let statusString = ''
  let icon = <IconAlertCircle style={{ width: 64, height: 64, color: '#b91c1c' }} />
  if (state.overallUp === 0 && state.overallDown === 0) {
    statusString = t('No data yet')
  } else if (state.overallUp === 0) {
    statusString = t('All systems not operational')
  } else if (state.overallDown === 0) {
    statusString = t('All systems operational')
//  icon = <IconCircleCheck style={{ width: 64, height: 64, color: '#059669' }} />
    icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="0" fill="#129900">
      <animate
        id="svgSpinnersPulseMultiple0"
        fill="freeze"
        attributeName="r"
        begin="0;svgSpinnersPulseMultiple2.end"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="0;11"
      />
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="0;svgSpinnersPulseMultiple2.end"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="1;0"
      />
    </circle>
    <circle cx="12" cy="12" r="0" fill="#129900">
      <animate
        id="svgSpinnersPulseMultiple1"
        fill="freeze"
        attributeName="r"
        begin="svgSpinnersPulseMultiple0.begin+0.2s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="0;11"
      />
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="svgSpinnersPulseMultiple0.begin+0.2s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="1;0"
      />
    </circle>
    <circle cx="12" cy="12" r="0" fill="#129900">
      <animate
        id="svgSpinnersPulseMultiple2"
        fill="freeze"
        attributeName="r"
        begin="svgSpinnersPulseMultiple0.begin+0.4s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="0;11"
      />
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="svgSpinnersPulseMultiple0.begin+0.4s"
        calcMode="spline"
        dur="1.2s"
        keySplines=".52,.6,.25,.99"
        values="1;0"
      />
    </circle>
  </svg>
)

    
  } else {
    statusString = t('Some systems not operational', {
      down: state.overallDown,
      total: state.overallUp + state.overallDown,
    })
  }

  const [openTime] = useState(Math.round(Date.now() / 1000))
  const [currentTime, setCurrentTime] = useState(Math.round(Date.now() / 1000))
  const isWindowVisible = useWindowVisibility()
  const [expandUpcoming, setExpandUpcoming] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isWindowVisible) return
      if (currentTime - state.lastUpdate > 300 && currentTime - openTime > 30) {
        window.location.reload()
      }
      setCurrentTime(Math.round(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  })

  const now = new Date()

  const activeMaintenances: (Omit<MaintenanceConfig, 'monitors'> & {
    monitors?: MonitorTarget[]
  })[] = maintenances
    .filter((m) => now >= new Date(m.start) && (!m.end || now <= new Date(m.end)))
    .map((maintenance) => ({
      ...maintenance,
      monitors: maintenance.monitors?.map(
        (monitorId) => monitors.find((mon) => monitorId === mon.id)!
      ),
    }))

  const upcomingMaintenances: (Omit<MaintenanceConfig, 'monitors'> & {
    monitors?: (MonitorTarget | undefined)[]
  })[] = maintenances
    .filter((m) => now < new Date(m.start))
    .map((maintenance) => ({
      ...maintenance,
      monitors: maintenance.monitors?.map(
        (monitorId) => monitors.find((mon) => monitorId === mon.id)!
      ),
    }))

  return (
    <Container size="md" mt="xl">
      <Center>{icon}</Center>

    
      <Title mt="sm" style={{ textAlign: 'center' }} order={1}>
        {statusString}
      </Title>
      <Title mt="sm" style={{ textAlign: 'center', color: '#70778c' }} order={5}>
        {t('Last updated on', {
          date: new Date(state.lastUpdate * 1000).toLocaleString(),
          seconds: currentTime - state.lastUpdate,
        })}
      </Title>



     {/* 新增的多语言文本 */}
    <Center mt="sm">
      <div style={{ textAlign: 'center', fontSize: '16px' }}>
        {t('cloudflareLatencyDescription')}
      </div>
    </Center>


      
      {/* Upcoming Maintenance */}
      {upcomingMaintenances.length > 0 && (
        <>
          <Title mt="4px" style={{ textAlign: 'center', color: '#70778c' }} order={5}>
            {t('upcoming maintenance', { count: upcomingMaintenances.length })}{' '}
            <span
              style={{ textDecoration: 'underline', cursor: 'pointer' }}
              onClick={() => setExpandUpcoming(!expandUpcoming)}
            >
              {expandUpcoming ? t('Hide') : t('Show')}
            </span>
          </Title>

          <Collapse in={expandUpcoming}>
            {upcomingMaintenances.map((maintenance, idx) => (
              <MaintenanceAlert
                key={`upcoming-${idx}`}
                maintenance={maintenance}
                style={{ maxWidth: groupedMonitor ? '897px' : '865px' }}
                upcoming
              />
            ))}
          </Collapse>
        </>
      )}

      {/* Active Maintenance */}
      {activeMaintenances.map((maintenance, idx) => (
        <MaintenanceAlert
          key={`active-${idx}`}
          maintenance={maintenance}
          style={{ maxWidth: groupedMonitor ? '897px' : '865px' }}
        />
      ))}
    </Container>
  )
}

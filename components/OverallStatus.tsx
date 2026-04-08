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
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   width="64"
  //   height="64"
  //   viewBox="0 0 24 24"
  // >
  //   <circle cx="12" cy="12" r="0" fill="#129900">
  //     <animate
  //       id="svgSpinnersPulseMultiple0"
  //       fill="freeze"
  //       attributeName="r"
  //       begin="0;svgSpinnersPulseMultiple2.end"
  //       calcMode="spline"
  //       dur="1.2s"
  //       keySplines=".52,.6,.25,.99"
  //       values="0;11"
  //     />
  //     <animate
  //       fill="freeze"
  //       attributeName="opacity"
  //       begin="0;svgSpinnersPulseMultiple2.end"
  //       calcMode="spline"
  //       dur="1.2s"
  //       keySplines=".52,.6,.25,.99"
  //       values="1;0"
  //     />
  //   </circle>
  //   <circle cx="12" cy="12" r="0" fill="#129900">
  //     <animate
  //       id="svgSpinnersPulseMultiple1"
  //       fill="freeze"
  //       attributeName="r"
  //       begin="svgSpinnersPulseMultiple0.begin+0.2s"
  //       calcMode="spline"
  //       dur="1.2s"
  //       keySplines=".52,.6,.25,.99"
  //       values="0;11"
  //     />
  //     <animate
  //       fill="freeze"
  //       attributeName="opacity"
  //       begin="svgSpinnersPulseMultiple0.begin+0.2s"
  //       calcMode="spline"
  //       dur="1.2s"
  //       keySplines=".52,.6,.25,.99"
  //       values="1;0"
  //     />
  //   </circle>
  //   <circle cx="12" cy="12" r="0" fill="#129900">
  //     <animate
  //       id="svgSpinnersPulseMultiple2"
  //       fill="freeze"
  //       attributeName="r"
  //       begin="svgSpinnersPulseMultiple0.begin+0.4s"
  //       calcMode="spline"
  //       dur="1.2s"
  //       keySplines=".52,.6,.25,.99"
  //       values="0;11"
  //     />
  //     <animate
  //       fill="freeze"
  //       attributeName="opacity"
  //       begin="svgSpinnersPulseMultiple0.begin+0.4s"
  //       calcMode="spline"
  //       dur="1.2s"
  //       keySplines=".52,.6,.25,.99"
  //       values="1;0"
  //     />
  //   </circle>
  // </svg>
  <svg
  width="64"
  height="64"
  viewBox="0 0 512 512"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#10B981" />
      <stop offset="100%" stopColor="#059669" />
    </linearGradient>
  </defs>

  <circle
    cx="256"
    cy="256"
    r="248"
    fill="url(#g)"
    fillOpacity="0.1"
    stroke="url(#g)"
    strokeWidth="16"
  >
    <animate
      attributeName="stroke-opacity"
      values=".6;1;.6"
      dur="3s"
      repeatCount="indefinite"
    />
  </circle>

  <path
    d="M96 256L176 256L208 196L256 316L304 196L336 256L416 256"
    stroke="url(#g)"
    strokeWidth="24"
    strokeLinecap="round"
    strokeLinejoin="round"
    filter="url(#glow)"
  >
    <animate
      attributeName="stroke-dasharray"
      from="0,1000"
      to="1000,0"
      dur="1.5s"
      repeatCount="indefinite"
    />
    <animate
      attributeName="stroke-opacity"
      values=".4;1;.4"
      dur="1.5s"
      repeatCount="indefinite"
    />
  </path>

  <g filter="url(#glow)">
    <circle
      cx="256"
      cy="256"
      r="32"
      fill="url(#g)"
      fillOpacity="0"
      stroke="url(#g)"
      strokeWidth="3"
    >
      <animate
        attributeName="r"
        keyTimes="0;0.7;0.701;1"
        values="32;200;32;32"
        dur="3s"
        begin="0s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-opacity"
        keyTimes="0;0.7;0.701;1"
        values=".8;0;0;.8"
        dur="3s"
        begin="0s"
        repeatCount="indefinite"
      />
    </circle>

    <circle
      cx="256"
      cy="256"
      r="32"
      fill="url(#g)"
      fillOpacity="0"
      stroke="url(#g)"
      strokeWidth="3"
    >
      <animate
        attributeName="r"
        keyTimes="0;0.7;0.701;1"
        values="32;200;32;32"
        dur="3s"
        begin="1.5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-opacity"
        keyTimes="0;0.7;0.701;1"
        values=".8;0;0;.8"
        dur="3s"
        begin="1.5s"
        repeatCount="indefinite"
      />
    </circle>

    <circle
      cx="256"
      cy="256"
      r="48"
      fill="url(#g)"
      fillOpacity="0.2"
    >
      <animate
        attributeName="r"
        values="42;52;42"
        dur="2s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        values=".1;.3;.1"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>

    <circle cx="256" cy="256" r="32" fill="url(#g)">
      <animate
        attributeName="r"
        values="28;32;28"
        dur="1.5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        values=".8;1;.8"
        dur="1.5s"
        repeatCount="indefinite"
      />
    </circle>

    <circle cx="256" cy="256" r="16" fill="#fff" fillOpacity="0.8">
      <animate
        attributeName="r"
        values="14;16;14"
        dur="1.5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="fill-opacity"
        values=".7;.9;.7"
        dur="1.5s"
        repeatCount="indefinite"
      />
    </circle>
  </g>
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

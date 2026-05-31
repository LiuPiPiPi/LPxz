import React, { Suspense } from 'react'
import { Spin } from 'antd'

const Loading = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
    </div>
)

const loadable = (loader) => {
    const LazyComponent = React.lazy(loader)
    return (props) => (
        <Suspense fallback={<Loading />}>
            <LazyComponent {...props} />
        </Suspense>
    )
}

export default loadable
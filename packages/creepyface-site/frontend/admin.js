import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import CreepyFace, { getHostedImages } from './components/CreepyFace'
import Button from './components/Button'
import Language from './components/Language'
import State from './components/State'
import merge from 'lodash.merge'
import Logo from './components/Logo'
import Loader from './components/Loader'
import range from 'lodash.range'
import Chart from 'chart.js'
import { DateTime } from 'luxon'
import debounce from 'lodash.debounce'
import Select from 'react-select'
import Icon from './components/Icon'

function ListItem(props) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        setVisible(entry.intersectionRatio > 0)
      })
    })
    observer.observe(ref.current)
    return () => observer.unobserve(ref.current)
  }, [])
  return <li ref={ref}>{props.children(visible)}</li>
}

class SelectableList extends React.Component {
  state = {
    selection: new Set(),
    size: 'small'
  }
  render() {
    const { items, actions } = this.props
    const { selection, size } = this.state
    const selected = [...selection]
      .map(uuid => items.find(c => c.uuid === uuid))
      .filter(item => !!item)
    const actionIcons = Object.keys(
      selected.map(actions).reduce(merge, {})
    ).filter(icon => selected.every(item => actions(item)[icon]))

    return (
      <>
        {selected.length > 0 && (
          <div id="selection" className="light">
            <div className="info">
              <Button
                icon="times"
                onClick={() => this.setState({ selection: new Set() })}
              />{' '}
              <span>{selected.length} selected </span>
              <Button
                type="link"
                onClick={() =>
                  this.setState({
                    selection: new Set(items.map(({ uuid }) => uuid))
                  })
                }
              >
                Select all
              </Button>
            </div>
            <div className="actions">
              {actionIcons.map(icon => (
                <Button
                  key={icon}
                  icon={icon}
                  onClick={() =>
                    selected.forEach(item => actions(item)[icon]())
                  }
                />
              ))}
            </div>
          </div>
        )}
        <small>
          <button
            onClick={() =>
              this.setState({ size: size === 'small' ? 'big' : 'small' })
            }
          >
            <Icon name={size === 'big' ? 'grid' : 'grid-sm'} />
          </button>
        </small>
        <ol className={size}>
          {items.map((item, i) => (
            <ListItem key={item.uuid + i}>
              {visible => (
                <label>
                  <input
                    type="checkbox"
                    checked={selection.has(item.uuid)}
                    onChange={({ target: { checked } }) => {
                      selection[checked ? 'add' : 'delete'](item.uuid)
                      this.setState({ selection })
                    }}
                  />
                  {this.props.children(item, visible, selection.has(item.uuid))}
                </label>
              )}
            </ListItem>
          ))}
        </ol>
      </>
    )
  }
}

class Analytics extends React.Component {
  state = { analytics: undefined, days: 7 }
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }
  componentDidMount() {
    this.reload()
  }
  reload = debounce(() => {
    this.setState({ loading: true })
    fetch(`/analytics?days=${this.state.days}`)
      .then(res => res.json())
      .then(analytics =>
        this.setState(
          {
            analytics,
            loading: false,
            selectedCharts: this.state.selectedCharts || [
              { value: analytics.names[0], label: analytics.names[0] }
            ]
          },
          this.updateChart
        )
      )
  }, 500)
  updateChart = () => {
    let {
      chart,
      days,
      analytics: { dates },
      selectedCharts
    } = this.state
    const canvas = this.canvasRef.current
    const today = DateTime.local()
    const color = i =>
      [
        [26, 188, 156],
        [20, 141, 204],
        [61, 122, 153],
        [255, 87, 64],
        [204, 20, 36]
      ][i % 5]
    const labels = range(days).map(i =>
      today.minus({ days: days - i - 1 }).toFormat('ccc')
    )
    const charts = selectedCharts.map(({ value }) => value)
    const datasets = charts.map((name, i) => ({
      label: name,
      backgroundColor: `rgba(${color(i)[0]}, ${color(i)[1]}, ${
        color(i)[2]
      }, 0.3)`,
      borderColor: `rgb(${color(i)[0]}, ${color(i)[1]}, ${color(i)[2]})`,
      data: range(days)
        .reverse()
        .map(i => (dates[i] && dates[i][name]) || 0)
    }))

    if (!chart && canvas) {
      chart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: { labels, datasets }
      })
      this.setState({ chart })
    } else {
      chart.data.labels = labels
      chart.data.datasets = datasets
      chart.update()
    }
  }
  render() {
    const { analytics, loading, selectedCharts } = this.state
    return !analytics ? (
      <Loader />
    ) : (
      <div className="chart">
        <div className="options">
          <input
            disabled={loading}
            type="number"
            min={1}
            value={this.state.days}
            onChange={e => this.setState({ days: e.target.value }, this.reload)}
          />
          <Select
            className="select-chart"
            closeMenuOnSelect={false}
            isDisabled={loading}
            isMulti
            options={analytics.names.map(name => ({
              label: name,
              value: name
            }))}
            onChange={selectedCharts =>
              this.setState({ selectedCharts }, this.updateChart)
            }
            value={selectedCharts}
          />
        </div>
        <canvas ref={this.canvasRef} />
      </div>
    )
  }
}

class Admin extends React.Component {
  state = {
    creepyfaces: undefined,
    approved: false
  }
  api(path = '', method = 'GET') {
    return fetch(`/admin/${path}`, {
      credentials: 'include',
      method,
      headers: {
        Accept: 'application/json'
      }
    })
      .then(res => res.json())
      .then(creepyfaces => this.setState({ creepyfaces }))
  }
  componentDidMount() {
    this.api()
  }
  render() {
    const { creepyfaces, approved } = this.state
    const filteredCreepyfaces = creepyfaces
      ? creepyfaces.filter(cf => (approved ? cf.approved : true))
      : []
    return (
      <>
        <header className="light">
          <h1 className="logo" onClick={() => (window.location = '/')}>
            {filteredCreepyfaces.length} <Logo hidePointer={true} />s
          </h1>
          <small className="filter">
            <button onClick={() => this.setState({ approved: !approved })}>
              Show {approved ? 'all' : 'approved'}
            </button>
          </small>
        </header>
        {creepyfaces && (
          <SelectableList
            items={filteredCreepyfaces}
            actions={({ uuid, approved, canUseAsSample }) => ({
              'thumbs-up':
                !!canUseAsSample &&
                !approved &&
                (() => this.api(`${uuid}/approve`, 'POST')),
              'thumbs-down':
                !!approved && (() => this.api(`${uuid}/unapprove`, 'POST')),
              trash: () => this.api(`${uuid}`, 'DELETE'),
              code: () => this.api(`${uuid}/namespace`, 'POST')
            })}
          >
            {(
              { uuid, approved, canUseAsSample, canUseForResearch, namespace },
              visible,
              selected
            ) => (
              <>
                <CreepyFace
                  images={getHostedImages(
                    uuid,
                    !selected ? 'small' : undefined
                  )}
                  hidden={!visible}
                />
                <div className="badges">
                  {namespace && (
                    <small className="badge">
                      <strong>{namespace}</strong>
                    </small>
                  )}
                  {!!canUseAsSample && !approved && (
                    <small className="badge">
                      <strong>New!</strong>
                    </small>
                  )}
                  {!!approved && !this.state.approved && (
                    <small className="badge">
                      <strong>
                        <Icon name="accept" />
                      </strong>
                    </small>
                  )}
                  {!!canUseForResearch && (
                    <small className="badge">
                      <strong>
                        <Icon name="camera" />
                      </strong>
                    </small>
                  )}
                </div>
              </>
            )}
          </SelectableList>
        )}
      </>
    )
  }
}

ReactDOM.render(
  <State>
    <Language>
      <Admin />
    </Language>
  </State>,
  document.getElementById('root')
)

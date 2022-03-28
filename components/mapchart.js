import React, { useEffect } from 'react'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import am4geodata_europeLow from '@amcharts/amcharts4-geodata/region/world/europeLow'

export default function MapChart() {
  useEffect(() => {
    if (document.getElementById('mapchart')) {
      // Create map instance
      var chart = am4core.create('mapchart', am4maps.MapChart)

      // Set map definition
      chart.geodata = am4geodata_europeLow

      // Set projection
      chart.projection = new am4maps.projections.Mercator()

      chart.numberFormatter.numberFormat = '0.#a'
      chart.numberFormatter.bigNumberPrefixes = [{ number: 1e3, suffix: ' tCO2eq' }]

      var groupData = [
        {
          title: "First group",
          id: 'DE',
          emission: 1324,
        },
        {
          title: "Second group",
          id: 'GB',
          emission: 6464,
        },
        {
          title: "Third group",
          id: 'ES',
          emission: 42432,
        },
        {
          title: "Fourth group",
          id: 'FR',
          emission: 3535,
        },
      ]

      chart.seriesContainer.draggable = false
      chart.seriesContainer.resizable = false
      chart.chartContainer.wheelable = false
      chart.seriesContainer.events.disableType('doublehit')
      chart.chartContainer.background.events.disableType('doublehit')

      // Create map polygon series
      var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries())

      polygonSeries.data = groupData

      // This array will be populated with country IDs to exclude from the world series
      var includedCountries = []

      groupData.forEach(function (country) {
        includedCountries.push(country.id)
      })

      polygonSeries.include = includedCountries

      // Make map load polygon (like country names) data from GeoJSON
      polygonSeries.useGeodata = true
      polygonSeries.mapPolygons.template.nonScalingStroke = true
      polygonSeries.mapPolygons.template.stroke = '#ffffff'
      polygonSeries.mapPolygons.template.strokeOpacity = 0.5

      // Configure series
      polygonSeries.mapPolygons.template.tooltipText = '{title} {emission}'
      polygonSeries.mapPolygons.template.fill = '#000000'
      polygonSeries.mapPolygons.template.cursorOverStyle =
        am4core.MouseCursorStyle.pointer

      // Create hover state and set alternative fill color
      var hs = polygonSeries.mapPolygons.template.states.create('hover')
      hs.properties.fill = '#fdd757'
    }
  })
  return (
    <div className="flex">
      <div className="h-400 w-full" id="mapchart"></div>
    </div>
  )
}

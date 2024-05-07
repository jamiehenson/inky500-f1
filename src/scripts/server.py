import asyncio
import time
import json
from ably import AblyRealtime
from accapi.client import AccClient, Event

# Modify appropriately
ACC_URL = "127.0.0.1"
ACC_PORT = 9000
ACC_PASSWORD = "asd"

# Create client
client = AccClient()

# Set up globals
driver_data = {}
live_data = {}
total_time = 0
connected = False
name = "Test Sesh 3000"
track_length = 0

def on_connection_state_change(event: Event) -> None:
  print(f"New connection state: {event.content}")
  global connected
  connected = event.content == "established"

def handle_track_update(event: Event) -> None:
  global track_length
  track_length = event.content.trackMeters

def handle_realtime_update(event: Event) -> None:
  global total_time
  total_time = event.content.sessionTimeMs

def handle_realtime_car_update(event: Event) -> None:
  live_data[event.content.carIndex] = { "lap": event.content.laps, "spline": event.content.splinePosition, "kmh": event.content.kmh }

def handle_entry_update(event: Event) -> None:
  id = event.content.carIndex

  driver_data[id] = {
      "model": event.content.modelType,
      "team": event.content.teamName,
      "nationality": event.content.drivers[0].nationality,
      "driver": event.content.drivers[0].firstName + " " + event.content.drivers[0].lastName
  }

client.onTrackDataUpdate.subscribe(handle_track_update)
client.onConnectionStateChange.subscribe(on_connection_state_change)
client.onEntryListCarUpdate.subscribe(handle_entry_update)
client.onRealtimeCarUpdate.subscribe(handle_realtime_car_update)
client.onRealtimeUpdate.subscribe(handle_realtime_update)

client.start(ACC_URL, ACC_PORT, ACC_PASSWORD)


async def main():
  # Connect to Ably with your API key
  ably = AblyRealtime('lTQPrA.-iRpAQ:aLBd5k5RozpsMLTn2mgk1MwPBE3yn6hP8H5Y5ZR65wk')
  await ably.connection.once_async('connected')
  print('Connected to Ably')

  channel = ably.channels.get('acc')

  while(connected):
    if len(live_data) > 0 and len(driver_data) > 0:
      await channel.publish('race', json.dumps({
        "live": live_data, 
        "drivers": driver_data, 
        "time": total_time, 
        "name": name, 
        "track": track_length
      }))
    time.sleep(1)

asyncio.run(main())

function fetchTiles(tileGrid, rootFolder, tileServerUrl) {
    /*
     * For Expo to be able to download the tiles,
     * the directories have to be created first.
     */
    const create_directories = tileGrid.map((tile) => {
      const folder = `${rootFolder}/${tile.z}/${tile.x}`
      return FileSystem.makeDirectoryAsync(folder, {
        intermediates: true,
      })
    })
    await Promise.all(create_directories)
    
    
    const tile_downloads = tiles.map(tile => {
      const fetchUrl = `${tileServerUrl}/${tile.z}/${tile.x}/${tile.y}.png`
      const fsLocation = `${rootFolder}/${tile.z}/${tile.x}/${tile.y}.png`
      
      return FileSystem.downloadAsync(fetchUrl, fsLocation)
    })
  
    const fileStatuses = await Promise.all(tile_downloads)
    
    /*
    // Debug downloaded files
    fileStatuses.forEach(file => {
      console.log('Downloaded, file.uri)
    })
    */
  }
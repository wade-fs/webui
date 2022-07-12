function replace(){
	for i in *svg; do F=$(echo $i | sed 's/, /-/g'); mv "$i" $F; done
}

function toLower(){
	for i in *svg; do F=${i,,}; mv $i $F; done
}

function mv_app() {
  Target=$1; shift
  for type in APP RDS VNC; do
    for color in Active Error; do
      for Override in False True; do
        if [ "${Override}" = "True" ]; then
  		f="Type=${type}-Color=${color}-Override=True.svg"
          if [ -f "${f}" ]; then
            echo mv ${f} ${Target}-${type}-${color}-override.svg
            mv ${f} ${Target}-${type}-${color}-override.svg
          fi
        else
          f="Type=${type}-Color=${color}-Override=False.svg"
          if [ -f "${f}" ]; then
            echo mv ${f} ${Target}-${type}-${color}.svg
            mv ${f} ${Target}-${type}-${color}.svg
          fi
        fi
      done
      f="Type=${type}-Color=${color}.svg"
      if [ -f "${f}" ]; then
        echo mv ${f} ${Target}-${type}-${color}.svg
        mv ${f} ${Target}-${type}-${color}.svg
      fi
    done
  done
}

function mv_term(){
  Target=$1; shift
  for status in Default Busy Disable; do
    for color in Active Booting Error Nolic Off; do
      for NTR in False True; do
        f="Type=Terminal-Status=${status}-Color=${color}-NTR=${NTR}.svg"
        if [ "$status" = "Default" ]; then
          if [ "${NTR}" = "False" ]; then
            t="${Target}-terminal-${color}.svg"
          else
            t="${Target}-terminal-${color}-restart.svg"
          fi
        else
          if [ "${NTR}" = "False" ]; then
            t="${Target}-terminal-${color}-${status}.svg"
          else
            t="${Target}-terminal-${color}-${status}-restart.svg"
          fi
        fi
        if [ -f "${f}" ]; then
          echo mv ${f} ${t}
          mv ${f} ${t}
        fi
      done
    done
  done
}

cd List-icon
replace
mv_app list
mv_term list
toLower

cd Item-icon
replace
mv_app item
mv_term item
toLower

import React, { useEffect } from 'react';

export default function PreventClosePage({
  shouldShowCloseAlert = false,
}){

  useEffect(() => {
    if(shouldShowCloseAlert){
      window.onbeforeunload = function() {
        return " "
      }
    }
    return () => {
      window.onbeforeunload = undefined;
    }
  }, [shouldShowCloseAlert]);

  return null;
}
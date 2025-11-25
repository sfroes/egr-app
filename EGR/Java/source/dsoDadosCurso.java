// *** Generated Source File ***
// Portions Copyright (c) 1996-2001, SilverStream Software, Inc., All Rights Reserved


import java.awt.*;
import java.util.*;
import java.math.*;
import com.sssw.rt.gui.*;
import com.sssw.rt.util.*;
import com.sssw.rt.event.*;
import java.awt.event.*;
import com.sssw.srv.api.*;
import com.sssw.srv.mail.*;
import com.sssw.srv.busobj.*;
import java.io.*;
import java.sql.*;

public class dsoDadosCurso
	implements AgiInitDatas,
	AgiDataSourceListener
{

	private Vector _ag_children = new Vector();
	private Vector _ag_names = new Vector();
	
	




public void invokeQuery(AgoDataSourceEvent evt)
		throws Exception
	{
		// Busca os parametros
		Hashtable hshQueryInfo = null;	
		hshQueryInfo = (Hashtable) evt.getParameter();

		// Parametros
		String sCodCurso =("" + hshQueryInfo.get("sCodCurso"));
		
		
		// Monta a query		
		String sQuery = 
		"select	cod_curso_oferta " +
		",	nom_curso " +
		"from	vw_ss_curso " +
		" where cod_curso_oferta = " + sCodCurso;

		// Pega a conexão com o banco
		AgiDatabase db = evt.getDatabase();
		try 
		{
			if (db != null)
			{
				// Executa a query
				evt.executeSQL(db, "" + sQuery);
				evt.setResult("Success");
			}
			else
			{
				evt.setResult("Error");
			}
		}
		catch (Exception ex) 
		{
			Hashtable hs = new Hashtable();
			hs.put("pIdentificador", "EGR - dsoDadosCurso.invokeQuery()" );
			hs.put("pException", ex);
			db.invokeBusinessObject("Util:boEnviaMsgConsole", hs);
			
			evt.setResult(ex.toString());
		}
		return;
	}

	public dsoDadosCurso()
	{
		//==== Warning: SilverStream-generated method: do not edit. All changes will be lost ===

		return;
	}

	public void ag_initDataStores(AgoBusinessObjectEvent e) throws Exception
	{
		//==== Warning: SilverStream-generated method: do not edit. All changes will be lost ===
		return;
	}

}
